<?php
namespace App\DataFixtures;

use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use App\Entity\Student;
use App\Entity\Exam;

class UserFixtures extends Fixture
{
    private UserPasswordHasherInterface $passwordHasher;

    public function __construct(UserPasswordHasherInterface $passwordHasher)
    {
        $this->passwordHasher = $passwordHasher;
    }

    public function load(ObjectManager $manager): void
    {
        $user = new User();
        $user->setEmail('admin@example.com');
        $user->setRoles(['ROLE_ADMIN']);
        $user->setPassword(
            $this->passwordHasher->hashPassword($user, 'secret123')
        );

        $manager->persist($user);
        $manager->flush();


        // Création des étudiants
        $studentsData = [
            ['name' => 'Jean'],
            ['name' => 'Jack'],
            ['name' => 'Goldman'],
        ];

        $students = [];
        foreach ($studentsData as $data) {
            $student = new Student();
            $student->setName($data['name']);
            $manager->persist($student);
            $students[] = $student;
        }


        // Création d'un examen
            $exam = new Exam();
        $exam->setStudent($students[0]); // Jean
        $exam->setLocation('Tana');
        $exam->setDate(new \DateTime('2025-10-10'));
        $exam->setTime(new \DateTime('10:00:00'));
        $exam->setStatus('Confirmé');
        $manager->persist($exam);


        $manager->flush();

    }
}
